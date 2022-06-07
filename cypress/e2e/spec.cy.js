const URL = "http://127.0.0.1:8080";

context('Memotest', () => {
  beforeEach(() => { //antes de cualquier prueba, abro la URL
    cy.visit(URL);
  });

  describe('juega al memotest', () => {

    it('se asegura de que cargue la página', () => {
      cy.contains('Jugar');
    })

    it('se asegura de que las pantallas se carguen correctamente', () => {
      cy.get('#pantalla-inicio').should('not.have.class', 'oculto');
      cy.get('#pantalla-juego').should('have.class', 'oculto');
    })

    it('se asegura que haya un tablero con cuadros', () => {
      const CANT_TARJETAS = 12;
      cy.get('#tablero').find('.tarjeta').should('have.length', CANT_TARJETAS);
    });

    it('se asegura de que los cuadros sean aleatorios', () => {
      let distribucion1 = [];
      let distribucion2 = [];

      cy.get('#pantalla-inicio button').click();
      cy.get('.tarjeta').then($tarjetas => {
        $tarjetas.each((i, tarjeta) => {
          tarjeta.click();
          distribucion1.push(tarjeta.textContent);
          tarjeta.click();
        })
      })

      cy.visit(URL);
      cy.get('#pantalla-inicio button').click();
      cy.get('.tarjeta').then($tarjetas => {
        $tarjetas.each((i, tarjeta) => {
          tarjeta.click();
          distribucion2.push(tarjeta.textContent);
          tarjeta.click();
        })
      })

      
      cy.wrap(distribucion1).should('not.deep.equal', distribucion2);
    });
  });
  
  describe('resuelve el juego', () => {
  
    it('elige una combinación errónea', () => {
      let listaDePares;
    
      cy.get('#pantalla-inicio button').click();

      cy.get('.tarjeta').then($tarjetas => {
        let distribucion = [];
        $tarjetas.each((i, tarjeta) => {
          tarjeta.click();
          distribucion.push(tarjeta.textContent);
          tarjeta.click();
        })
        return distribucion;
      }).then(distribucion => {
        listaDePares = obtenerListaDePares(distribucion);
        return listaDePares;
      }).then(listaDePares => {
        cy.get(`#${listaDePares[0][0]}`).click();
        cy.get(`#${listaDePares[1][0]}`).click();
        //ninguna tarjeta deberia tener la clase encontrada
        cy.get(`#${listaDePares[0][0]}`).should('not.have.class', 'encontrada');
        cy.get(`#${listaDePares[1][0]}`).should('not.have.class', 'encontrada');
      })
    })

    it('resuelve correctamente el juego', () => {
      cy.get('#pantalla-inicio button').click();

      cy.get('.tarjeta').then($tarjetas => {
        let distribucion = [];
        $tarjetas.each((i, tarjeta) => {
          tarjeta.click();
          distribucion.push(tarjeta.textContent);
          tarjeta.click();
        })
        return distribucion;
      }).then(distribucion => {
        let listaDePares = obtenerListaDePares(distribucion);
        return listaDePares;
      }).then(listaDePares => {
          listaDePares.forEach(par => {
            cy.wait(1000)
            cy.get(`#${par[0]}`).click();
            cy.get(`#${par[1]}`).click();
          })
    
          cy.get('.tarjeta').then($tarjetas => {
            $tarjetas.each((i,$tarjeta) => {
              cy.wrap($tarjeta).should('have.class', 'encontrada')
            })
          })

          const CANT_TURNOS = 18
          cy.contains(`Ganaste! Y tardaste ${CANT_TURNOS} en completarlo. Presiona JUGAR para volver a intentarlo`)
      })
    })
  })
})


// [0,0,1,1,2,2,3,3,4,4,5,5]
function obtenerListaDePares(distribucion) {
  const mapaDePares = {};
  for(let i = 0; i < distribucion.length; i++) {
    if(mapaDePares[distribucion[i]]) {
      mapaDePares[distribucion[i]].push(i);
    }else{
      mapaDePares[distribucion[i]] = [i];
    }
  }
  return Object.values(mapaDePares);
}
